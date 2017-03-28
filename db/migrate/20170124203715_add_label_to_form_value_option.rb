class AddLabelToFormValueOption < ActiveRecord::Migration[5.0]
  def change
    add_column :form_value_options, :label, :string
  end
end
