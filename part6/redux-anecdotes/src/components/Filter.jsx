import { useDispatch } from "react-redux"
import { setFilter } from '../reducers/filterReducer'

const Filter = () => {
    const dispacth = useDispatch()

  const handleChange = (event) => {
    dispacth(setFilter(event.target.value))
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter