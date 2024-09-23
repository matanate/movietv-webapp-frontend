export interface FieldConfig {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'checkbox' | 'number' | 'select';
  required: boolean;
  options?: { value: string; label: string }[];
  optionsDisplayField?: string;
}
