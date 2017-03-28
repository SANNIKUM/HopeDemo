module AssignmentGraph::AssignmentProperties::Main

  def self.run(asg_hashes1, hash)
=begin
  hash is like
  {
    types: [
      {name: "route", properties: ["needs_nypd", "status"]},
      {name: "site", properties: ["has_wifi"]}
    ]
  }
=end
    normal_properties_arr, special_properties_arr = self.split_out_special_properties(hash[:types])
    asg_hashes2 = self.fetch_normal_properties(asg_hashes1, normal_properties_arr)
    asg_hashes3 = self.fetch_special_properties(asg_hashes2, special_properties_arr)
    asg_hashes3
  end

  private

  def self.split_out_special_properties(arr)
    arr.reduce([ [], [] ]) do |arr_arr, hash|
      props = hash[:properties]
      np, sp = props.partition{ |x| not self.special_properties.include?(x) }
      nh = {name: hash[:name], properties: np}
      sh = {name: hash[:name], properties: sp}
      arr_arr2 = [arr_arr[0].concat([nh]), arr_arr[1].concat([sh])]
      arr_arr2
    end
  end

  def self.special_properties
    %w(status longitude latitude)
  end

  def self.fetch_normal_properties(*args)
    AssignmentGraph::AssignmentProperties::FetchNormalProperties::Main.run(*args)
  end

  def self.fetch_special_properties(*args)
    AssignmentGraph::AssignmentProperties::FetchSpecialProperties::Main.run(*args)
  end
end
