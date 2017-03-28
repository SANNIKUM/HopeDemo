module SubmitForm::CollectUiPackage::CollectUiItemRelations

  def self.run(*args)
    self.query(*args).to_a.map{|x| x.deep_symbolize_keys!}
  end

  private

  def self.query(ids, assignment_ids)
    return [] if ids.empty?
    ids_string = "(#{ids.join(",")})"
    assignment_ids_piece = assignment_ids.any? ? "OR ar.assignment_id IN (#{assignment_ids.join(",")})" : ""

    string = <<-SQL
      WITH RECURSIVE table1 AS (
        SELECT
          uir.id,
          uir.parent_ui_item_id,
          uir.child_ui_item_id

        FROM ui_item_relations uir
        LEFT JOIN accessible_relations ar
          ON uir.id = ar.ui_item_relation_id
        WHERE parent_ui_item_id IN #{ids_string}
         AND (
           ar.id IS NULL
          #{assignment_ids_piece}
        )

        UNION

        SELECT
          uir.id,
          uir.parent_ui_item_id,
          uir.child_ui_item_id
        FROM table1
        JOIN ui_item_relations uir
          ON table1.child_ui_item_id = uir.parent_ui_item_id
        LEFT JOIN accessible_relations ar
          ON uir.id = ar.ui_item_relation_id

        WHERE ar.id IS NULL
            #{assignment_ids_piece}
      )
      SELECT id, parent_ui_item_id, child_ui_item_id FROM table1
    SQL
    ActiveRecord::Base.connection.execute(string)
  end
end
