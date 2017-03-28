class DropFormFieldsFormTypes < ActiveRecord::Migration[5.0]
  def change
    drop_table :form_fields_form_types
  end
end
