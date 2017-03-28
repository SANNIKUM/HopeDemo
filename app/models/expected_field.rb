class ExpectedField < ApplicationRecord
  self.table_name = 'expected_fields'
  belongs_to :assignment
  belongs_to :form_field
end
