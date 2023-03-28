const mongoose = require('mongoose')


mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('connecting to', url)


mongoose.connect(url)
	.then((/*result*/) => {
		console.log('connected to MongoDB')
	})
	.catch(error => {
		console.log('error connecting to MongoDB:', error.message)
	})

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 3,
		required: true,
	},
	number: {
		type: String,
		minLength: 8,
		required: true,
		validate: {
			validator: value => {
				const ret = /^(\d{2,3}-)?\d+$/.test(value)
				console.log('validating ' + value + ', result: ' + ret)
				return ret
			},
			message: props => `${props.value} is not a valid phone number`,
		}
	},
})

personSchema.set('toJSON', {
	transform: (doc, ret) => {
		ret.id = ret._id.toString()
		delete ret._id
		delete ret.__v
	}
})

module.exports = mongoose.model('Person', personSchema)


