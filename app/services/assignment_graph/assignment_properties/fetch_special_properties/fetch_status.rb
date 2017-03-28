module AssignmentGraph::AssignmentProperties::FetchSpecialProperties::FetchStatus

  def self.run(ats, asgs)
    query = self.fetch_status(ats, asgs)
    ActiveRecord::Base.connection.execute(query)
  end

  private

  def self.fetch_status(ats, asgs)
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
          sfs.id as submitted_form_id,
          fvs3.datetime_value as created_at,
          asgs1.name as form_type_category_name,
          fvos2.assignment_id as assignment_id

        FROM submitted_forms sfs

        /* connect to formTypeCategory */
        JOIN form_values fvs1
          ON sfs.id = fvs1.submitted_form_id
        JOIN form_value_options fvos1
          ON fvs1.form_value_option_id = fvos1.id
        JOIN assignments asgs1
          ON fvos1.assignment_id = asgs1.id
        JOIN assignment_types ats1
          ON asgs1.assignment_type_id = ats1.id

        /* assignment whose status we need */
        JOIN form_values fvs2
          ON sfs.id = fvs2.submitted_form_id
        JOIN form_value_options fvos2
          ON fvs2.form_value_option_id = fvos2.id

        /* created_at */
        JOIN form_values fvs3
          ON sfs.id = fvs3.submitted_form_id
        JOIN form_fields ffs1
          ON fvs3.form_field_id = ffs1.id


        WHERE ats1.name = 'formTypeCategory'
        AND ((asgs1.name = 'checkIn') OR (asgs1.name = 'checkOut'))
        AND  fvos2.assignment_id IN (SELECT asg_id FROM table0)
        AND ffs1.name = 'submittedAt'
      ),

      table2 AS (
        SELECT table1.assignment_id, MAX(table1.created_at) as max_created_at
        FROM table1
        GROUP BY table1.assignment_id

      ),

      table3 AS (
        SELECT
          table1.form_type_category_name as form_type_category_name,
          table1.assignment_id as assignment_id
        FROM table1
        JOIN table2
          ON     table1.created_at = table2.max_created_at
             AND table1.assignment_id = table2.assignment_id
      ),

      table4 AS (
        SELECT asgs1.id as assignment_id,
               asgs2.id as related_assignment_id
        FROM assignments asgs1
        JOIN assignment_relations ars
        ON (
            asgs1.id = ars.assignment_1_id
            OR
            asgs1.id = ars.assignment_2_id
           )
        JOIN assignments asgs2
        ON (
            asgs2.id = ars.assignment_1_id
            OR
            asgs2.id = ars.assignment_2_id
           )
        JOIN assignment_types ats
          ON asgs2.assignment_type_id = ats.id
        WHERE ats.name = 'team'
          AND asgs1.id != asgs2.id
          AND asgs1.id IN (SELECT asg_id FROM table0)
      )

      SELECT
        asgs.id AS assignment_id,
        CASE
          WHEN table3.form_type_category_name IS NULL
            THEN 'not_started'
          WHEN table3.form_type_category_name = 'checkIn'
            THEN 'in_progress'
          WHEN table3.form_type_category_name = 'checkOut'
            THEN 'completed'
        END as status

      FROM assignments asgs
      LEFT JOIN table3
        ON asgs.id = table3.assignment_id
      WHERE asgs.id IN (SELECT asg_id FROM table0)
    SQL
  end

end
