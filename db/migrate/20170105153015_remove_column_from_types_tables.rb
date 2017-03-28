class RemoveColumnFromTypesTables < ActiveRecord::Migration[5.0]
  def change
    remove_column :assignment_property_types,  :is_just_string, :boolean
    remove_column :ui_item_property_types,  :is_just_string, :boolean
  end
end
