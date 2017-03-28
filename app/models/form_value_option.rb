class FormValueOption < ApplicationRecord
  has_many :form_values, dependent: :nullify
  belongs_to :form_field
  belongs_to :assignment
end
