class FormFieldValueOption < ApplicationRecord
  self.table_name = "form_fields_value_options"
  belongs_to :form_field
  belongs_to :form_value_option
end
