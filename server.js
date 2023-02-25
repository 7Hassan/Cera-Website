const app = require('./index')






// const fs = require('fs')
// let data = ''
// let obj = ``
// dataSeed()


//? Run server 
const port = process.env.PORT
app.listen(port, () => console.log(`app listening on port ${port}`))





// function dataSeed() {
//   const path = './public/imgs/products'
//   let files = fs.readdirSync(path, 'utf-8')
//   for (let i = 0; i < files.length; i++) {
//     if (files[i].includes('jpg') || files[i].includes('webp')) {
//       let result = files.filter(file => file == (files[i].split('.')[0]))
//       if (result.length != 0) {
//         const imgs = fs.readdirSync(`${path}/${result[0]}`, 'utf-8')
//         const imgData = []
//         imgs.map((img) => imgData.push(`'imgs/products/${result[0]}/${img}'`))

//         obj = `{
//             stoked: ${true},
//               imgSrc: 'imgs/products/${files[i]}',
//                 imgs: [${imgData}],
//                   name: 'T-Shirt',
//                     stars: ${Math.round((Math.random() * 4) + 1)},
//                       price: ${Math.round((Math.random() * 500) + 1)},
//             },`
//       } else {
//         obj = `{
//             stoked: ${true},
//               imgSrc: 'imgs/products/${files[i]}',
//                 imgs: [],
//                   name: 'T-Shirt',
//                     stars: ${Math.round((Math.random() * 4) + 1)},
//                       price: ${Math.round((Math.random() * 500) + 1)},
//             },`
//       }
//     }
//     data += obj
//   }
//   fs.writeFileSync('./test.js', data, 'utf-8')


// }