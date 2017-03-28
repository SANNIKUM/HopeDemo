class CreateAssignmentFormFields < ActiveRecord::Migration[5.0]
  def change
    create_table :assignment_form_fields do |t|
      t.references :assignment, foreign_key: true, index: true
      t.references :form_field, foreign_key: true, index: true
    end
  end
end
