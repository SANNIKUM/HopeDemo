class FormValue < ApplicationRecord
  belongs_to :form_field
  belongs_to :submitted_form
  belongs_to :form_value_option
end
