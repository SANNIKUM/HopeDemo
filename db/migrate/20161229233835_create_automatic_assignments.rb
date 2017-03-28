class CreateAutomaticAssignments < ActiveRecord::Migration[5.0]
  def change
    create_table :automatic_assignments do |t|
      t.integer :origin_type_id
      t.integer :connector_type_id
      t.integer :target_type_id
      t.integer :connection_limit
    end
  end
end
