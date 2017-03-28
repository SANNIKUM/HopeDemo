class CreateExpectedFields < ActiveRecord::Migration[5.0]
  def change
    create_table :expected_fields do |t|
      t.references :assignment, foreign_key: true
      t.references :form_field, foreign_key: true
    end
  end
end
