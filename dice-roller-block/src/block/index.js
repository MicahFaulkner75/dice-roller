import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import Edit from './edit';
import './editor.scss';

// Register the block using metadata from block.json
registerBlockType('dice-roller-block/dice-roller', {
    edit: Edit,
    // Dynamic block, render handled by PHP
    save: () => null,
}); 