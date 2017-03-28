class CreateAccessibleRelations < ActiveRecord::Migration[5.0]
  def change
    create_table :accessible_relations do |t|
      t.references :assignment, foreign_key: true, index: true
      t.references :ui_item_relation, foreign_key: true, index: true
    end
  end
end
