module AssignmentGraph::AssignmentProperties::FetchSpecialProperties::Main

  def self.run(asgs, properties_arr)
    hash = Hash.new { |h, k| h[k] = [] }
    properties_arr.each do |el|
      el[:properties].each do |property_name|
        hash[property_name].push(el[:name])
      end
    end

    hash.each do |property_name, ats|
      asgs = self.fetch_properties(property_name, ats, asgs)
    end

    asgs
  end

  private

  def self.fetch_properties(property_name, ats, asgs)
    return self.handle_status(ats, asgs) if property_name == 'status'
    return self.handle_location(ats, asgs) if property_name === 'location'
    return self.handle_submitted_forms_count(ats, asgs) if property_name === 'submitted_forms_count'
    asgs
  end

  def self.handle_status(ats, asgs)
    result = AssignmentGraph::AssignmentProperties::FetchSpecialProperties::FetchStatus.run(ats, asgs)
    self.merge_result(asgs, result)
  end

  def self.handle_location(ats, asgs)
    result = AssignmentGraph::AssignmentProperties::FetchSpecialProperties::FetchLocation.run(ats, asgs)
    self.merge_result(asgs, result)
  end

  def self.handle_submitted_forms_count(ats, asgs)
    result = AssignmentGraph::AssignmentProperties::FetchSpecialProperties::FetchSubmittedFormsCount.run(ats, asgs)
    puts "sfc : #{result.to_json}"
    self.merge_result(asgs, result)
  end

  def self.merge_result(asgs, result)
    result.each do |h|
      idx = asgs.find_index { |asg| asg[:id] == h["assignment_id"] }
      if idx
        properties = self.delete_key(h, "assignment_id")
        asgs[idx][:properties] = Hash.new() if asgs[idx][:properties].nil?
        asgs[idx][:properties].deep_merge!(properties.deep_symbolize_keys)
      end
    end
    asgs
  end

  def self.delete_key(hash, key)
    hash2 = hash.dup
    hash2.delete(key)
    hash2
  end

end
