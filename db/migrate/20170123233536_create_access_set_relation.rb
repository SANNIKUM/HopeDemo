class CreateAccessSetRelation < ActiveRecord::Migration[5.0]
  def change
    create_table :access_set_relations do |t|
      t.references :assignment, foreign_key: true, index: true
      t.references :access_set, foreign_key: true, index: true
    end
  end
end
