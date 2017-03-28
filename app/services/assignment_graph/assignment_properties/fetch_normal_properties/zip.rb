module AssignmentGraph::AssignmentProperties::FetchNormalProperties::Zip
  def self.run(asg_hashes, properties_arr, result)
    asg_types = result.map{|r| {name: r[:assignment_type_name], id: r[:assignment_type_id]} }.uniq
    Reduce.run([], self.create_helper(properties_arr, asg_hashes, result), asg_types)
  end


  def self.create_helper(properties_arr, asg_hashes, result)
    lambda do |acc, asg_type|
      sub_asg_hashes = asg_hashes.select{|x| x[:assignment_type_id] == asg_type[:id]}
      just_properties = properties_arr.find{|x| x[:name] == asg_type[:name]}[:properties]
      new_sub_asg_hashes = Map.run(self.create_helper2(result, just_properties), sub_asg_hashes)
      puts "new_sub_asg_hashes  : #{new_sub_asg_hashes.to_json}"
      acc.concat(new_sub_asg_hashes)
    end
  end

  def self.create_helper2(result, just_properties)
    lambda do |asg_hash|
      asg_hash[:properties] = asg_hash[:properties] || {}
      r = result.find{ |x| x[:id] == asg_hash[:id] }
      just_properties.reduce(asg_hash) do |acc, prop|
        acc[:properties][prop.to_sym] = r[prop.to_sym]
        acc
      end
    end
  end
end
