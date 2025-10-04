#!/usr/bin/env tsx

/**
 * Parser for FIST community traits and roles from Google Doc format
 *
 * Usage:
 *   npx tsx parse-community-content.ts [input-file]
 *
 * If no input file is provided, defaults to src/lib/json/COMMUNITY_INDEX_SAMPLE.txt
 *
 * Outputs:
 *   - src/lib/json/community_traits.json
 *   - src/lib/json/community_roles.json
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Types based on existing JSON structure
interface CommunityTrait {
	number: number;
	name: string;
	effect: string;
	item: string;
	stat: string;
	author: string;
}

// Stat abbreviation mapping (matches src/lib/traits.ts)
const STAT_ABBREVIATIONS: Record<string, string> = {
	FRC: 'FORCEFUL',
	TAC: 'TACTICAL',
	CRE: 'CREATIVE',
	RFX: 'REFLEXIVE'
};

interface CommunityRole {
	number: number;
	name: string;
	text: string;
	author: string;
}

function parseCommunityContent(filePath: string) {
	const content = readFileSync(filePath, 'utf-8');

	// Split into traits and roles sections
	const sections = content.split(/ROLES\s*\n\s*INDEX/i);
	const traitsSection = sections[0].split(/TRAITS\s*\n\s*INDEX/i)[1] || '';
	const rolesSection = sections[1] || '';

	console.log('Found traits section length:', traitsSection.length);
	console.log('Found roles section length:', rolesSection.length);

	// Parse traits
	const traits = parseTraits(traitsSection);
	console.log(`Parsed ${traits.length} traits`);

	// Parse roles
	const roles = parseRoles(rolesSection);
	console.log(`Parsed ${roles.length} roles`);

	return { traits, roles };
}

function parseTraits(traitsSection: string): CommunityTrait[] {
	const traits: CommunityTrait[] = [];

	// Split by separator lines (5 or more underscores)
	const traitBlocks = traitsSection.split(/_{5,}/);

	for (const block of traitBlocks) {
		const trimmedBlock = block.trim();
		if (!trimmedBlock || trimmedBlock.includes('Copy below the line')) {
			continue;
		}

		try {
			const trait = parseTraitBlock(trimmedBlock);
			if (trait) {
				traits.push(trait);
			}
		} catch (error) {
			console.warn('Failed to parse trait block:', error);
			console.warn('Block content:', trimmedBlock.substring(0, 100) + '...');
		}
	}

	return traits;
}

function parseTraitBlock(block: string): CommunityTrait | null {
	const lines = block
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line);

	if (lines.length < 2) {
		return null;
	}

	// Skip template entries
	if (block.includes('Copy below the line') || block.includes('TRAIT: description')) {
		return null;
	}

	// Find the main trait line (NAME: description)
	let traitLine = '';
	let effectStart = -1;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.includes(':') && !isBulletLine(line) && !line.startsWith('[')) {
			traitLine = line;
			effectStart = i + 1;
			break;
		}
	}

	if (!traitLine) {
		return null;
	}

	// Parse trait name and initial effect
	const colonIndex = traitLine.indexOf(':');
	const name = traitLine.substring(0, colonIndex).trim();
	const effect = traitLine.substring(colonIndex + 1).trim();

	// Find author line index and extract author
	let authorIndex = -1;
	let author = '';

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		const authorMatch = line.match(/\[AUTHORS?:\s*([^\]]+)\]/);
		if (authorMatch) {
			authorIndex = i;
			author = authorMatch[1].trim();
			break;
		}
	}

	// Parse content between effect start and author, separating effect from items
	const { effectText, itemLines } = separateEffectFromItems(
		lines,
		effectStart,
		authorIndex,
		effect
	);

	// Parse items and stats from item lines
	const { item, stat } = parseItemLines(itemLines);

	// Generate a number (we'll need to assign these systematically)
	const number = generateTraitNumber(name);

	return {
		number,
		name: name.toUpperCase(),
		effect: formatDescriptionText(effectText.trim()),
		item: item.trim(),
		stat: stat.trim(),
		author: author.trim()
	};
}

function isBulletLine(line: string): boolean {
	return /^[*•\-+]\s/.test(line);
}

function getBulletType(line: string): string | null {
	const match = line.match(/^([*•\-+])\s/);
	return match ? match[1] : null;
}

function separateEffectFromItems(
	lines: string[],
	effectStart: number,
	authorIndex: number,
	initialEffect: string
) {
	const endIndex = authorIndex === -1 ? lines.length : authorIndex;
	let effectText = initialEffect;
	const itemLines: string[] = [];

	// Find all bullet line groups and their positions
	const bulletGroups: Array<{ start: number; end: number; type: string }> = [];
	let currentGroup: { start: number; end: number; type: string } | null = null;

	for (let i = effectStart; i < endIndex; i++) {
		const line = lines[i];

		if (isBulletLine(line)) {
			const bulletType = getBulletType(line);

			if (!currentGroup || currentGroup.type !== bulletType) {
				// Start new group
				if (currentGroup) {
					bulletGroups.push(currentGroup);
				}
				currentGroup = { start: i, end: i, type: bulletType! };
			} else {
				// Continue current group
				currentGroup.end = i;
			}
		} else if (currentGroup && line.trim() === '') {
			// Empty line might separate groups, but don't end current group yet
			continue;
		} else if (currentGroup && line.trim() !== '') {
			// Non-bullet, non-empty line ends current group
			bulletGroups.push(currentGroup);
			currentGroup = null;
		}
	}

	// Add final group if exists
	if (currentGroup) {
		bulletGroups.push(currentGroup);
	}

	// Determine which bullet group is the item group (last one before author)
	const itemGroupIndex = bulletGroups.length > 0 ? bulletGroups.length - 1 : -1;

	// Process all lines
	for (let i = effectStart; i < endIndex; i++) {
		const line = lines[i];

		// Find which bullet group this line belongs to (if any)
		let isItemLine = false;
		if (isBulletLine(line) && itemGroupIndex >= 0) {
			const itemGroup = bulletGroups[itemGroupIndex];
			if (i >= itemGroup.start && i <= itemGroup.end) {
				isItemLine = true;
			}
		}

		if (isItemLine) {
			itemLines.push(line);
		} else if (line.trim() !== '') {
			effectText += ' ' + line;
		}
	}

	return { effectText, itemLines };
}

function parseItemLines(itemLines: string[]): { item: string; stat: string } {
	if (itemLines.length === 0) {
		return { item: '', stat: '' };
	}

	const items: string[] = [];
	const stats: string[] = [];

	for (const line of itemLines) {
		// Remove bullet point and parse
		const content = line.replace(/^[*•\-+]\s/, '').trim();

		// Look for stat modifiers at the end
		const statMatch = content.match(/,\s*([+-]\d+\s+[A-Z]+(?:\s+[A-Z]+)*|[+-]\d+\s+to\s+[^,]+)$/);
		if (statMatch) {
			const stat = normalizeStatName(statMatch[1].trim());
			const item = content.substring(0, statMatch.index).replace(/,\s*$/, '').trim();
			if (item) items.push(item);
			if (stat) stats.push(stat);
		} else {
			// Check for stat modifiers without comma
			const statMatch2 = content.match(/\s+([+-]\d+\s+[A-Z]+(?:\s+[A-Z]+)*)$/);
			if (statMatch2) {
				const stat = normalizeStatName(statMatch2[1].trim());
				const item = content.substring(0, statMatch2.index).trim();
				if (item) items.push(item);
				if (stat) stats.push(stat);
			} else {
				// Just an item with no stat
				if (content) items.push(content);
			}
		}
	}

	return {
		item: items.join(', '),
		stat: stats.join(', ')
	};
}

function normalizeStatName(statString: string): string {
	// Handle patterns like "+2 TAC" or "-1 FORCEFUL"
	const match = statString.match(/^([+-]\d+)\s+(.+)$/);
	if (!match) {
		return statString;
	}

	const modifier = match[1];
	const statName = match[2];

	// Check if it's an abbreviation that needs to be expanded
	const fullName = STAT_ABBREVIATIONS[statName];
	if (fullName) {
		return `${modifier} ${fullName}`;
	}

	return statString;
}

function formatDescriptionText(text: string): string {
	// Add line breaks before numbers (like "1. ", "2. ", etc.) and bullet points
	return text
		.replace(/\s+(\d+\.)\s+/g, '\n$1 ') // "1. ", "2. ", etc.
		.replace(/\s+([•\-+]\s)/g, '\n$1') // bullet points with space after
		.trim();
}

function parseRoles(rolesSection: string): CommunityRole[] {
	const roles: CommunityRole[] = [];

	// Split by separator lines (5 or more underscores)
	const roleBlocks = rolesSection.split(/_{5,}/);

	for (const block of roleBlocks) {
		const trimmedBlock = block.trim();
		if (!trimmedBlock || trimmedBlock.includes('Copy below the line')) {
			continue;
		}

		try {
			const role = parseRoleBlock(trimmedBlock);
			if (role) {
				roles.push(role);
			}
		} catch (error) {
			console.warn('Failed to parse role block:', error);
			console.warn('Block content:', trimmedBlock.substring(0, 100) + '...');
		}
	}

	return roles;
}

function parseRoleBlock(block: string): CommunityRole | null {
	const lines = block
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line);

	if (lines.length < 2) {
		return null;
	}

	// Skip template entries
	if (block.includes('Copy below the line') || block.includes('TITLE: describe x, advance if y')) {
		return null;
	}

	// Find the main role line (NAME: description)
	let roleLine = '';
	let textStart = -1;

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i];
		if (line.includes(':') && !line.startsWith('[')) {
			roleLine = line;
			textStart = i + 1;
			break;
		}
	}

	if (!roleLine) {
		return null;
	}

	// Parse role name and initial text
	const colonIndex = roleLine.indexOf(':');
	const name = roleLine.substring(0, colonIndex).trim();
	let text = roleLine.substring(colonIndex + 1).trim();

	// Continue collecting text lines until we hit an author
	let author = '';

	for (let i = textStart; i < lines.length; i++) {
		const line = lines[i];
		const authorMatch = line.match(/\[AUTHORS?:\s*([^\]]+)\]/);

		if (authorMatch) {
			author = authorMatch[1].trim();
			// If author is inline, extract the text before it
			const authorTagStart = line.search(/\[AUTHORS?:/);
			const beforeAuthor = line.substring(0, authorTagStart).trim();
			if (beforeAuthor) {
				text += ' ' + beforeAuthor;
			}
			break;
		} else {
			// Continue building text
			text += ' ' + line;
		}
	}

	// Find author if not found yet (check all lines)
	if (!author) {
		for (const line of lines) {
			const authorMatch = line.match(/\[AUTHORS?:\s*([^\]]+)\]/);
			if (authorMatch) {
				author = authorMatch[1].trim();
				break;
			}
		}
	}

	// Generate a number (we'll need to assign these systematically)
	const number = generateRoleNumber(name);

	return {
		number,
		name: name.toUpperCase(),
		text: text.trim(),
		author: author.trim()
	};
}

// Simple hash-based number generation to ensure consistency with a variant of djb2
function generateHashNumber(name: string, digits: number = 6): number {
	let hash = 0;
	for (let i = 0; i < name.length; i++) {
		const char = name.charCodeAt(i);
		hash = (hash << 5) - hash + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	// Calculate the range based on digits
	const min = Math.pow(10, digits - 1);
	const max = Math.pow(10, digits) - 1;
	const range = max - min + 1;
	return min + (Math.abs(hash) % range);
}

function generateTraitNumber(name: string): number {
	return generateHashNumber(name, 5);
}

function generateRoleNumber(name: string): number {
	return generateHashNumber(name, 5);
}

// Main execution
function main() {
	const inputFile = process.argv[2] || 'src/lib/json/COMMUNITY_INDEX_SAMPLE.txt';
	const outputDir = 'src/lib/json';

	console.log(`Parsing community content from: ${inputFile}`);

	try {
		const { traits, roles } = parseCommunityContent(inputFile);

		// Write traits to JSON
		const traitsOutput = join(outputDir, 'community_traits.json');
		writeFileSync(traitsOutput, JSON.stringify(traits, null, '\t'));
		console.log(`✅ Wrote ${traits.length} community traits to ${traitsOutput}`);

		// Write roles to JSON
		const rolesOutput = join(outputDir, 'community_roles.json');
		writeFileSync(rolesOutput, JSON.stringify(roles, null, '\t'));
		console.log(`✅ Wrote ${roles.length} community roles to ${rolesOutput}`);

		// Write metadata with timestamp
		const metadataOutput = join(outputDir, 'community_metadata.json');
		const metadata = {
			lastSyncedAt: new Date().toISOString(),
			traitsCount: traits.length,
			rolesCount: roles.length
		};
		writeFileSync(metadataOutput, JSON.stringify(metadata, null, '\t'));
		console.log(`✅ Wrote metadata to ${metadataOutput}`);

		// // Output some examples for verification
		// if (traits.length > 0) {
		// 	console.log('\n📋 Sample trait:');
		// 	console.log(JSON.stringify(traits[0], null, 2));
		// }

		// if (roles.length > 0) {
		// 	console.log('\n📋 Sample role:');
		// 	console.log(JSON.stringify(roles[0], null, 2));
		// }
	} catch (error) {
		console.error('❌ Error parsing community content:', error);
		process.exit(1);
	}
}

main();
