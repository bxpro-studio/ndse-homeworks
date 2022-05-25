# добавление
db.books.insertMany([{title: 'book 1 title', description: 'book 1 description', authors: 'book 1 authors'}, {title: 'book 2 title', description: 'book 2 description', authors: 'book 2 authors'}])

# поиск по title
db.books.find({title: 'book 1 title'})

# обновление
db.books.updateOne({_id: ObjectId('372f1...ekf2b92'), {$set: {description: 'new description', authors: 'new authors'}})