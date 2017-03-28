require 'rails_helper'

describe Reduce do

  def subject(initial, pom, arr)
    Reduce.run(initial, pom, arr)
  end

  def proc1
    lambda do |acc, ele|
      acc + ele
    end
  end

  it 'works' do
    arr = [1, 2]
    result = subject(1, proc1, arr)
    expect(result).to eq(4)
  end
end
