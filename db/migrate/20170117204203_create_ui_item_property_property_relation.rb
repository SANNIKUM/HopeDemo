class CreateUiItemPropertyPropertyRelation < ActiveRecord::Migration[5.0]
  def change
    create_table :ui_item_property_property_relations do |t|
      t.integer :parent_id, index: true
      t.integer :child_id, index: true
    end
  end
end
