import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { 
    PanelBody, 
    SelectControl, 
    ToggleControl,
    RangeControl
} from '@wordpress/components';

const Edit = ({ attributes, setAttributes }) => {
    const { position, initiallyOpen, mobileScale } = attributes;
    
    return (
        <>
            <InspectorControls>
                <PanelBody title={__('Dice Roller Settings', 'dice-roller-block')}>
                    <SelectControl
                        label={__('Position', 'dice-roller-block')}
                        value={position}
                        options={[
                            { label: 'Bottom Right', value: 'bottom-right' },
                            { label: 'Bottom Left', value: 'bottom-left' },
                            { label: 'Top Right', value: 'top-right' },
                            { label: 'Top Left', value: 'top-left' },
                            { label: 'Center', value: 'center' },
                        ]}
                        onChange={(newPosition) => setAttributes({ position: newPosition })}
                    />
                    <ToggleControl
                        label={__('Initially Open', 'dice-roller-block')}
                        checked={initiallyOpen}
                        onChange={(newState) => setAttributes({ initiallyOpen: newState })}
                    />
                    <RangeControl
                        label={__('Mobile Scale', 'dice-roller-block')}
                        value={mobileScale}
                        onChange={(value) => setAttributes({ mobileScale: value })}
                        min={0.5}
                        max={1.5}
                        step={0.1}
                    />
                </PanelBody>
            </InspectorControls>
            <div className="dice-roller-block-editor">
                <div className="dice-roller-preview">
                    <img 
                        src={`${window.diceRollerSettings?.pluginUrl || ''}/assets/dice-roller-preview.png`} 
                        alt="Dice Roller Preview" 
                    />
                    <div className="dice-roller-preview-info">
                        <p>{__('Dice Roller will appear here on the frontend', 'dice-roller-block')}</p>
                        <p>{__(`Position: ${position}`, 'dice-roller-block')}</p>
                        <p>{initiallyOpen 
                            ? __('Initially open: Yes', 'dice-roller-block') 
                            : __('Initially open: No', 'dice-roller-block')}
                        </p>
                        <p>{__(`Mobile scale: ${mobileScale}x`, 'dice-roller-block')}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Edit; 