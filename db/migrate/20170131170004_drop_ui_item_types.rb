class DropUiItemTypes < ActiveRecord::Migration[5.0]
  def change
    drop_table :ui_item_types
  end
end
