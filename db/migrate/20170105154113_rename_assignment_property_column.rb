class RenameAssignmentPropertyColumn < ActiveRecord::Migration[5.0]
  def change
    rename_column :assignment_properties, :string_value, :value
  end
end
