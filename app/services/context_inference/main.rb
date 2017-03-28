module ContextInference::Main

  def self.run(seed_context_ids)
    asgs = Assignment.where(id: seed_context_ids)
    g2 = self.group_by_assignment_type(asgs)
    hash = self.traverse_graph(g2, seed_context_ids)
    hash.reduce([]) do |acc, (k, v)|
      acc.concat(v)
      acc
    end
  end

  private

  def self.group_by_assignment_type(asgs)
    hs = asgs.map{|x| x.class.name == "Hash" ? x : x.attributes}.map{|x| x.deep_symbolize_keys}
    gs = hs.group_by{|x| x[:assignment_type_id]}
    is = gs.reduce({}) do |acc, (k, v)|
      acc[k] = v.map{|x| x[:id]}
      acc
    end
    is
  end

  def self.group_by_assignment_type_and_merge_by_origin(query_result)
    hs = query_result.map{|x| x.deep_symbolize_keys}.group_by{|x| x[:assignment_type_id] }
    is = hs.reduce({}) do |acc, (k, v)|
      acc[k] = self.helper1(v)
      acc
    end
    is
  end

  def self.helper1(arr)
    ids = arr.map{|x| x[:id]}
    arr.group_by{|x| x[:origin_assignment_type_id]}.reduce(ids) do |acc, (k, v)|
      acc & v.map{|x| x[:id]}
    end
  end

  def self.traverse_graph(hash, seed_context_ids)
    ids = self.extract_ids(hash)
    query_result = self.query(ids, seed_context_ids) # {id: ..., assignment_type_id: ...}
    next_batch = self.group_by_assignment_type_and_merge_by_origin(query_result)
    next_hash = self.merge(hash, next_batch)
    stable = self.stable(hash, next_hash)
    if self.stable(hash, next_hash)
      next_hash
    else
      self.traverse_graph(next_hash, seed_context_ids)
    end
  end

  def self.merge(old_hash, new_hash)
    keys = old_hash.keys.concat(new_hash.keys).uniq
    merged = keys.reduce({}) do |acc, k|
      old_value = old_hash[k]
      new_value = new_hash[k]
      if old_value.nil?
        merged = new_value
      elsif new_value.nil?
        merged = old_value
      else
        merged = old_value & new_value # gets set intersection
      end
      acc[k] = merged
      acc
    end
    merged
  end

  def self.stable(old_hash, new_hash)

    return true if new_hash.empty?
    new_hash.reduce(true) do |acc, (k, v)|
      bool = true
      if old_hash[k].nil?
        bool = false
      else
        bool = (old_hash[k].length == v.length)
      end
      acc && bool
    end
  end

  def self.query(ids, seed_context_ids)
    string = "
      #{self.assignment_edge(1, ids, seed_context_ids)}
      UNION
      #{self.assignment_edge(2, ids, seed_context_ids)}
    "
    ActiveRecord::Base.connection.execute(string)
  end

  def self.assignment_edge(self_side, ids, seed_context_ids)
    ids_string = self.ids_string(ids)
    other_side = self_side == 1 ? 2 : 1
    seed_context_ids_string = self.ids_string(seed_context_ids)
    "
      SELECT
        origin_asgs.assignment_type_id as origin_assignment_type_id,
        target_asgs.id as id,
        target_asgs.assignment_type_id as assignment_type_id

      FROM assignments origin_asgs
      JOIN assignment_types origin_types
        ON origin_asgs.assignment_type_id = origin_types.id
      JOIN assignment_relations ars
        ON origin_asgs.id = ars.assignment_#{self_side}_id
      JOIN assignments target_asgs
        ON ars.assignment_#{other_side}_id = target_asgs.id
      WHERE origin_asgs.id IN #{ids_string}
        AND (
              origin_types.predetermined IS NOT FALSE
              OR
              origin_asgs.id IN #{seed_context_ids_string}
            )
    "
  end

  def self.extract_ids(hash)
    hash.reduce([]){ |acc, (k, v)| acc.concat(v) }
  end

  def self.ids_string(arr)
    x = arr.length == 0 ? [0] : arr
    "(#{x.join(',')})"
  end

end
