module AssignmentGraph::AssignmentProperties::FetchSpecialProperties::FetchSubmittedFormsCount

  def self.run(ats, asgs)
    query_string = self.query_string(ats, asgs)
    ActiveRecord::Base.connection.execute(query_string)
  end

  private

  def self.query_string(ats, asgs)
    at_names_string = ats.map { |name| "'" + name + "'" }.join(', ')
    asg_ids_string = asgs.map { |asg| asg[:id] }.join(', ')

    <<-SQL
    WITH all_surveys AS (
      SELECT DISTINCT sfs.id as id
      FROM submitted_forms sfs
      JOIN form_values fvs
        ON sfs.id = fvs.submitted_form_id
      JOIN form_value_options fvos
        ON fvs.form_value_option_id = fvos.id
      JOIN assignments asgs
        ON fvos.assignment_id = asgs.id
      JOIN assignment_types ats
        ON asgs.assignment_type_id = ats.id
      WHERE ats.name = 'formTypeCategory'
      AND asgs.name = 'survey'
    )

    SELECT
      asgs.id as assignment_id,
      COUNT(DISTINCT all_surveys.id) as submitted_forms_count

    FROM assignments asgs
    LEFT JOIN assignment_types ats
      ON asgs.assignment_type_id = ats.id
    LEFT JOIN form_value_options fvos
      ON asgs.id = fvos.assignment_id
    LEFT JOIN form_values fvs
      ON fvos.id = fvs.form_value_option_id
    LEFT JOIN all_surveys
      ON all_surveys.id = fvs.submitted_form_id

    WHERE asgs.id IN (#{asg_ids_string})
      AND ats.name IN (#{at_names_string})
    GROUP BY asgs.id
    SQL

  end
end


=begin



=end
