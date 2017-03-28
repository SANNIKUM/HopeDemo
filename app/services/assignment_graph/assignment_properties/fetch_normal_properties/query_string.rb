module AssignmentGraph::AssignmentProperties::FetchNormalProperties::QueryString

  def self.run(just_properties, asg_ids)
    select_string = self.select_string(just_properties)
    join_string   = self.join_string(just_properties)

    asg_ids_string = asg_ids.join(",")
    <<-SQL
      #{select_string}
      FROM assignments asgs
      JOIN assignment_types ats
        ON asgs.assignment_type_id = ats.id
      #{join_string}
      WHERE asgs.id IN (#{asg_ids_string})
    SQL
  end

  private

  def self.select_string(just_properties)
    main = Map.run(method(:select_string_helper), just_properties).join(",")
    "
      SELECT asgs.id as id,
      asgs.assignment_type_id as assignment_type_id,
      ats.name as assignment_type_name,
      #{main}"
  end

  def self.select_string_helper(property_name, index)
    "aps_#{index}.value as #{property_name}"
  end

  def self.join_string(just_properties)
    main = Map.run(method(:join_string_helper), just_properties).join(" ")
  end

  def self.join_string_helper(property_name, index)
    <<-SQL
     LEFT JOIN assignment_property_types apts_#{index}
      ON apts_#{index}.name = '#{property_name}'
     LEFT JOIN assignment_properties aps_#{index}
     ON     apts_#{index}.id = aps_#{index}.assignment_property_type_id
        AND asgs.id = aps_#{index}.assignment_id
    SQL
  end

end
