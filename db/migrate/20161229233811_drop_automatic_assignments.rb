class DropAutomaticAssignments < ActiveRecord::Migration[5.0]
  def change
    drop_table :automatic_assignments
  end
end
