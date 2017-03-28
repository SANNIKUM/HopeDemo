class CreateHigherOrderAssignmentRelation < ActiveRecord::Migration[5.0]
  def change
    create_table :higher_order_assignment_relations do |t|
      t.integer :assignment_id
      t.integer :assignment_relation_id
    end
  end
end
