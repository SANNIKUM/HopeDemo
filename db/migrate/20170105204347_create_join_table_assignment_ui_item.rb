class CreateJoinTableAssignmentUiItem < ActiveRecord::Migration[5.0]
  def change
    create_join_table :assignments, :ui_items do |t|
      t.index [:assignment_id, :ui_item_id]
      t.index [:ui_item_id, :assignment_id]
    end
  end
end
