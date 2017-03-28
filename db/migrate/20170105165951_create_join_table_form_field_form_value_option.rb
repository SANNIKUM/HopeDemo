class CreateJoinTableFormFieldFormValueOption < ActiveRecord::Migration[5.0]
  def change
    create_join_table :form_fields, :form_value_options do |t|
    end
  end
end
