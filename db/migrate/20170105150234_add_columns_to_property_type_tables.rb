class AddColumnsToPropertyTypeTables < ActiveRecord::Migration[5.0]
  def change
    add_column :assignment_property_types,  :is_just_string, :boolean
    add_column :assignment_property_types, :is_singleton, :boolean
    add_column :ui_item_property_types,  :is_just_string, :boolean
    add_column :ui_item_property_types, :is_singleton, :boolean
  end
end
