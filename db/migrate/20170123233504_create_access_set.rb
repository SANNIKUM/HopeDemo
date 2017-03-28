class CreateAccessSet < ActiveRecord::Migration[5.0]
  def change
    create_table :access_sets do |t|
      t.references :ui_item, foreign_key: true, index: true
    end
  end
end
