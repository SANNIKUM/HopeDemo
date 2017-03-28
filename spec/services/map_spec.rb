require 'rails_helper'

describe Map do

  def subject(pom, arr)
    Map.run(pom, arr)
  end

  def proc1
    lambda do |ele|
      ele*2
    end
  end

  it 'works' do
    arr = [1, 2]
    result = subject(proc1, arr)
    expect(result).to eq([2, 4])
  end

  it 'takes index' do
    arr = [1, 2]
    result = Map.run(->(ele, i) { i }, arr)
    expect(result).to eq([0, 1])
  end
end
