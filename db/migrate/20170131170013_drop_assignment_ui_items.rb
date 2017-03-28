class DropAssignmentUiItems < ActiveRecord::Migration[5.0]
  def change
    drop_table :assignments_ui_items
  end
end
