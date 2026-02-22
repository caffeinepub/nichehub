import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export interface TextOverlayConfig {
  font: string;
  color: string;
  position: 'top' | 'center' | 'bottom';
}

interface TextOverlaySettingsProps {
  settings: TextOverlayConfig;
  onChange: (settings: TextOverlayConfig) => void;
}

const FONT_OPTIONS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Helvetica', label: 'Helvetica' },
  { value: 'Impact', label: 'Impact' },
  { value: 'Times New Roman', label: 'Times New Roman' },
  { value: 'Courier New', label: 'Courier New' },
];

const COLOR_PRESETS = [
  { value: '#FFFFFF', label: 'White' },
  { value: '#000000', label: 'Black' },
  { value: '#FF0000', label: 'Red' },
  { value: '#00FF00', label: 'Green' },
  { value: '#0000FF', label: 'Blue' },
  { value: '#FFFF00', label: 'Yellow' },
];

export default function TextOverlaySettings({ settings, onChange }: TextOverlaySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Text Overlay Settings</CardTitle>
        <CardDescription>
          Customize how the text appears on your video
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Font Selection */}
        <div className="space-y-2">
          <Label htmlFor="font-select">Font</Label>
          <Select
            value={settings.font}
            onValueChange={(value) => onChange({ ...settings, font: value })}
          >
            <SelectTrigger id="font-select">
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Color Selection */}
        <div className="space-y-2">
          <Label htmlFor="color-input">Text Color</Label>
          <div className="flex gap-2">
            <Input
              id="color-input"
              type="color"
              value={settings.color}
              onChange={(e) => onChange({ ...settings, color: e.target.value })}
              className="w-20 h-10 cursor-pointer"
            />
            <Select
              value={settings.color}
              onValueChange={(value) => onChange({ ...settings, color: value })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a color" />
              </SelectTrigger>
              <SelectContent>
                {COLOR_PRESETS.map((color) => (
                  <SelectItem key={color.value} value={color.value}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Position Selection */}
        <div className="space-y-3">
          <Label>Text Position</Label>
          <RadioGroup
            value={settings.position}
            onValueChange={(value: 'top' | 'center' | 'bottom') =>
              onChange({ ...settings, position: value })
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="top" id="position-top" />
              <Label htmlFor="position-top" className="cursor-pointer font-normal">
                Top
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="center" id="position-center" />
              <Label htmlFor="position-center" className="cursor-pointer font-normal">
                Center
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bottom" id="position-bottom" />
              <Label htmlFor="position-bottom" className="cursor-pointer font-normal">
                Bottom
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}
