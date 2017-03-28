module AssignmentGraph::AssignmentProperties::FetchNormalProperties::Main
#
   def self.run(asg_hashes, properties_arr)
# =begin
#   properties_arr is like :
#   [
#     {name: 'type1', properties: ['prop1', 'prop2']},
#     {name: 'type2', properties: ['prop1', 'prop3']}
#   ]
# =end
    just_properties = Reduce.run([], method(:just_properties), properties_arr).uniq
    return asg_hashes if just_properties.empty?
    asg_ids = Map.run(->h { h[:id] }, asg_hashes)
    query_string = self.query_string(just_properties, asg_ids)
    result = ActiveRecord::Base.connection.execute(query_string).to_a.map{|x| x.deep_symbolize_keys}
    self.zip(asg_hashes, properties_arr, result)    
   end

  private

  def self.just_properties(acc, hash)
    acc.concat(hash[:properties])
  end

  def self.query_string(*args)
    AssignmentGraph::AssignmentProperties::FetchNormalProperties::QueryString.run(*args)
  end

  def self.zip(*args)
    AssignmentGraph::AssignmentProperties::FetchNormalProperties::Zip.run(*args)
  end
end
