class FormField < ApplicationRecord
  has_and_belongs_to_many :form_types, dependent: :nullify
  has_many :form_value_options, dependent: :nullify
  has_many :form_values, dependent: :nullify
  has_many :ui_items, dependent: :nullify
  belongs_to :assignment_type

  def get_form_value_options
    fvs = self.form_values
    x = fvs.map do |fv|
      fv.form_value_option
    end
    y = x.compact
    z = y.map{|y1| y1.value}.uniq
    z
  end
end
