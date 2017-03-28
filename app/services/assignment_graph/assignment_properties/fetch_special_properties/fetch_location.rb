module AssignmentGraph::AssignmentProperties::FetchSpecialProperties::FetchLocation

  def self.run(ats, asgs)
    query = self.fetch_location(ats, asgs)
    ActiveRecord::Base.connection.execute(query)
  end

  private

  def self.fetch_location(ats, asgs)
    at_names = ats.map { |name| "'" + name + "'" }.join(', ')
    asg_ids = asgs.map { |asg| asg[:id] }.join(', ')

    <<-SQL
      WITH table0 AS (
        SELECT asgs.id AS asg_id
          FROM assignments AS asgs
          JOIN assignment_types AS ats
            ON asgs.assignment_type_id = ats.id
         WHERE ats.name IN (#{at_names})
           AND asgs.id IN (#{asg_ids})
      ),

      table1 AS (
        SELECT
          asgs.id as assignment_id,
          sfs.id as submitted_form_id,
          fvs2.datetime_value as submitted_form_created_at

        FROM assignments asgs
        JOIN form_value_options fvos1
          ON asgs.id = fvos1.assignment_id
        JOIN form_values fvs1
          ON fvos1.id = fvs1.form_value_option_id
        JOIN submitted_forms sfs
          ON fvs1.submitted_form_id = sfs.id

        JOIN form_values fvs2
          ON sfs.id = fvs2.submitted_form_id
        JOIN form_fields ffs1
          ON fvs2.form_field_id = ffs1.id

        WHERE asgs.id IN (SELECT asg_id FROM table0)
          AND ffs1.name = 'submittedAt'
      ),

      table2 AS (
        SELECT
          MAX(table1.submitted_form_created_at) as submitted_form_created_at
        FROM table1
      ),

      table3 AS (
        SELECT
          table1.assignment_id as assignment_id,
          table1.submitted_form_id as submitted_form_id
        FROM table1
        JOIN table2
          ON table1.submitted_form_created_at = table2.submitted_form_created_at
      )

      SELECT
        table3.assignment_id as assignment_id,
        fvs1.string_value as latitude,
        fvs2.string_value as longitude
      FROM table3
      JOIN form_values fvs1
        ON table3.submitted_form_id = fvs1.submitted_form_id
      JOIN form_fields ffs1
        ON fvs1.form_field_id = ffs1.id

      JOIN form_values fvs2
        ON table3.submitted_form_id = fvs2.submitted_form_id
      JOIN form_fields ffs2
        ON fvs2.form_field_id = ffs2.id

      WHERE ffs1.name = 'latitude'
        AND ffs2.name = 'longitude'
    SQL
  end

end
