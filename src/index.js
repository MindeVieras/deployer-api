
import path from 'path'
import app from './config/express'

// Landing page
app.get('*', function(req, res){
    res.sendFile(path.join(__dirname, './index.html'))
})

// Start HTTP server
app.listen(app.get('port'), app.get('host'), () => {
    console.log(`Server running at http://${app.get('host')}:${app.get('port')}`)
})

export default app

