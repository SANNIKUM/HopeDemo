module CamelizeKeys

  def self.run(item)
    if item.is_a?(Hash)
      self.handle_hash(item)
    elsif item.is_a?(Array)
      self.handle_array(item)
    else
      item
    end
  end

  private

  def self.handle_hash(hash)
    hash.reduce({}) do |acc, (k, v)|
      new_key = k.to_s.camelize(:lower).to_sym
      acc[new_key] = self.run(v)
      acc
    end
  end

  def self.handle_array(array)
    array.map{|ele| self.run(ele)}
  end
  
end
