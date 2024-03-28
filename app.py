from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
import datetime
from flask_marshmallow import Marshmallow
from flask_cors import CORS, cross_origin

app = Flask(__name__)
ma = Marshmallow(app)
CORS(app)

#Database Configuaration

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:''@localhost/pycrud'

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Task(db.Model):
    __tablename__ = "tasks"
    id = db.Column(db.Integer, primary_key=True)
    title =  db.Column(db.String(100), index=True)
    description = db.Column(db.String(500), index=True)
    due_date = db.Column(db.DateTime)
    completed = db.Column(db.Boolean, default=False)

    def __init__(self, title, description, due_date,  completed):
        self.title = title
        self.description = description
        self.due_date = due_date
        self.completed = completed



# SQLALCHEMY_TRACK_MODIFICATIONS = False
# SQLALCHEMY_ECHO = True

# db.init_app(app)

# with app.app_context():
#     db.create_all()
        


#Task Schema
        
class TaskSchema(ma.Schema):
    class Meta:
        fields = ('id', 'title', 'description', 'due_date', 'completed')

task_schema = TaskSchema()
tasks_schema = TaskSchema(many=True)


@app.route("/")
def hello_world():
    return "Hello World!"



#New Task
@app.route('/addtask', methods=['POST'])
def addtask():
    

    title = request.json['title']
    description = request.json['description']
    due_date = request.json['due_date']
    completed = request.json['completed']

    # completed = completed.lower() == 'true'

    tasks = Task(title, description, due_date, completed)
    db.session.add(tasks)
    db.session.commit()

    return task_schema.jsonify(tasks)


#Task List
@app.route('/tasklist', methods=['GET'])
def tasklist():
    all_tasks = Task.query.all()
    results = tasks_schema.dump(all_tasks)
    return jsonify(results)


#Task Details with ID
@app.route('/taskdetails/<id>', methods=['GET'])
def taskdetails(id):
    task = Task.query.get(id)
    return task_schema.jsonify(task)


#Task Update
@app.route('/taskupdate/<id>', methods=['PUT'])
def taskupdate(id):
    task = Task.query.get(id)

    title = request.json['title']
    description = request.json['description']
    due_date = request.json['due_date']
    completed = request.json['completed']

    # completed = completed.lower() == 'true'

    task.title = title
    task.description = description
    task.due_date = due_date
    task.completed = completed
    
    db.session.commit()
    return task_schema.jsonify(task)



#Task Delete
@app.route('/taskdelete/<id>', methods=['DELETE'])
def taskdelete(id):
    task = Task.query.get(id)
    db.session.delete(task)
    db.session.commit()
    return task_schema.jsonify(task)





if __name__ == "__main__":
    app.run(debug=True)

