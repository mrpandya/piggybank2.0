from flask import Flask,request,jsonify,abort
from flask_cors import CORS,cross_origin
import sqlite3

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

################## Welcome Page #################

@app.route('/')
def welcome():
    return '''
        <h1> Welcome to piggy bank api<h1>
    '''

################## Defined Functions ###########################
# for authentication
def find_user_table(user_id,password):
    db = sqlite3.connect('auth.db')
    cur = db.cursor()
    #fetching the row where username = user_id
    cur.execute('SELECT * FROM authentication WHERE username="{}"'.format(user_id))
    data = cur.fetchall()
    isSuccess = False
    # retrun true if the credentials are valid else retrun false
    if data[0] == user_id and data[1] == password:
        db.close()
        isSuccess = True
        return True
    if not isSuccess:
        db.close()
        return False

# to check if the user's data exists
def check_user_data(user_id):
    db = sqlite3.connect('user.db')
    cur = db.cursor()
    # fetching the names of the tables to find for the user's table
    cur.execute('SELECT name FROM sqlite_master WHERE type="table"')
    data = cur.fetchall()
    username = None
    for row in data:
        if row[0] == user_id:
            username = row[0]
            break
    db.close()
    # if the table is not found it returns false else true
    if not username:
        return False
    else:
        return True

# to get all the data of the user
def get_user_data(user_id):
    db = sqlite3.connect('user.db')
    cur = db.cursor()
    # fetching the data from the user's table
    cur.execute('SELECT * FROM {}'.format(user_id))
    data = cur.fetchall()
    db.close()
    return data

################## Get Methods ####################

#to get the balance of a user
@app.route('/api/balance/<user>',methods=['GET'])
def balance_user(user):
    # if you access this ap or any other thing that this app uses it raises an error so we can write this on a safe side
    with app.app_context():
        user_info={}
        user_balance=None
        # checking if the user has been created if not abort 404
        table_name=check_user_data(user)
        if not table_name:
            abort(404)
        else:
            # if its the first transaction of the user the data will be None therefore we will return a json object with the username and balance as 0
            data=get_user_data(user)
            if not data:
                return jsonify({'user':user,'balance':'0'}),200
            # -1 for the last ie the latest transaction and the the 0 for the balance
            user_balance=data[-1][0]
            # entering values in the dictionary and returning the json object
            user_info['user']=user
            user_info['balance']=user_balance
            return jsonify(user_info)


#to get the statement of the user account
@app.route('/api/statement/<user>',methods=['GET'])
def statement_user(user):
    # if you access this ap or any other thing that this app uses it raises an error so we can write this on a safe side
    with app.app_context():
        # initializing an empty dictionary for creating the final json object
        statement={}
        table_name=None
        table_data=None
        index=0
        # checking if the user has been created if not abort 404
        table_name=check_user_data(user)
        if not table_name:
            abort(404)
        else:
            # if its the first transaction of the user the data will be None therefore we will return a json object with balance as 0 and last transaction as 0
            table_data=get_user_data(user)
            if not table_data:
                return jsonify({0:{'balance':'0','last_transaction':'0'}}),200
            # reversing the data for the latest transaction to come first
            table_data=table_data[::-1]
            #creating a dictionary transaction which holds the data of a particular transaction which is balace and last transaction and then appending the transaction into the statement ( type of statement {key:{key:value}} )
            for data in table_data:
                transaction={}
                transaction['last_transaction']=data[1]
                transaction['balance']=data[0]
                statement[index]=transaction
                index+=1
            return jsonify(statement),200

################## Post Methods ###################

#to create a new account
@app.route('/api/create',methods=['POST'])
def create():
    # if you access this ap or any other thing that this app uses it raises an error so we can write this on a safe side
    with app.app_context():
        # checking if the request is a json object and it contains username and password
        if not request.json or not ('username' in request.json and 'password' in request.json):
            abort(400)
        # storing the username and password from the request into a dictionary named data
        data = {
            'username' : request.json['username'],
            'password' : request.json['password'],
        }
        db = sqlite3.connect('auth.db')
        cur = db.cursor()
        # to enter the username and the password in the auth database
        cur.execute('CREATE TABLE IF NOT EXISTS auth (username TEXT IS UNIQUE,password TEXT)')
        # to check if the user already exists
        cur.execute('SELECT * FROM auth')
        userList = cur.fetchall()
        doesExist = False
        for user in userList:
            if user[0] == data['username']:
                doesExist = True
                break
        # if the user doesnt exists then insert the username and password in the table else return a 400 response code
        if not doesExist:
            cur.execute('INSERT INTO auth VALUES (:username, :password)',data)
            db.commit()
            db.close()
        else:
            return jsonify({"username":"doesExist","status code":400}),400
        #to create a table for the user's statement in the user database and check if it was created successfully
        db = sqlite3.connect('user.db')
        cur = db.cursor()
        cur.execute('CREATE TABLE IF NOT EXISTS '+data['username']+' (balance TEXT,lastTransaction TEXT)')
        db.commit()
        db.close()
        # checking if the table has been created successfully
        check_user = check_user_data(data['username'])
        if not check_user:
            abort(502)  
        else:
            return jsonify({'user' : data['username'], 'successful':True}),201

#to delete an account
@app.route('/api/delete',methods=['POST'])
def delete():
    # if you access this app or any other thing that this app uses it raises an error so we can write this on a safe side
    with app.app_context():
        # to check if the request is a json object and the request has a username and password in it
        if not request.json or not ('username' in request.json and 'password' in request.json):
            abort(400)
        # storing the username and password from the request into a dict called data
        data = {
            'username' : request.json['username'],
            'password' : request.json['password'],
        }
        #to delete the username and password from the auth database
        db = sqlite3.connect('auth.db')
        cur = db.cursor()
        # creating a table auth just in case if a delete request is made and the table doesn't exists it might cause the server to crash
        cur.execute('CREATE TABLE IF NOT EXISTS auth (username TEXT IS UNIQUE,password TEXT)')
        # fetching the data from the auth table
        cur.execute('SELECT * FROM auth WHERE username = "{}"'.format(data['username']))
        userList = cur.fetchall()
        doesExist = False
        # checking if the username and password is correct and the user exists
        if userList[0] == data['username'] and userList[1] == data['password']:
            doesExist = True
        if not doesExist:
            abort(400)
        # deleting the user's credentials from tehe auth table
        cur.execute('DELETE FROM auth WHERE username = "{}"'.format(data['username']))
        db.commit()
        db.close()
        # to drop the user's table from the user database
        db = sqlite3.connect('user.db')
        cur = db.cursor()
        cur.execute('DROP TABLE {}'.format(data['username']))
        db.commit()
        db.close()
        # once deleted check if the table has been successfully droped
        check_user = check_user_data(data['username'])
        if check_user:
            abort(502)
        else:
            return jsonify({'username': data['username'],'successfully deleted': True}),201

# for athentication of the user
@app.route('/api/authenticate',methods=['POST'])
def authenticate():
    # if you access this app or any other thing that this app uses it raises an error so we can write this on a safe side
    with app.app_context():
        # to check if the request is a json object and it contains username and password
        if not request.json and not ('username' in request.json and 'password' in request.json):
            abort(400)
        # storing the username and password from the request into a dict called data
        data={
            'username':request.json['username'],
            'password':request.json['password'],
        }
        db = sqlite3.connect('auth.db')
        cur = db.cursor()
        # fetching the username and password from the auth table and checking it with the username and password from the request
        cur.execute('SELECT * FROM auth WHERE username = "{}"'.format(data['username']))
        authData = cur.fetchall()
        db.close()
        # matching the username and password from the table and the request
        if authData[0] == data['username'] and authData[1] == data['password']:
            return jsonify({'login':True}),201
        return jsonify({'login':False}),201
            
#to deposit in the user's account
@app.route('/api/deposit',methods=['POST'])
def deposit():
    # if you access this app or any other thing that this app uses it raises an error so we can write this on a safe side
    with app.app_context():
        # to check if the request is a json object and it contains username and amount in it
        if not request.json or not ('username' in request.json and 'amount' in request.json):
            abort(400)
        # the username and amount from the request is initialized in a dict called data
        data={
            'username':request.json['username'],
            'amount':request.json.get('amount'),
        }
        db=sqlite3.connect('user.db')
        cur=db.cursor()
        # to check if the user's table exists
        table_name=check_user_data(data['username'])
        if not table_name:
            abort(404)
        # fetching the data from the user's table to get the balance from the last transaction
        table_data=get_user_data(data['username'])
        transaction={}
        if table_data:
            # if the user has data already in the table we will take the balance and add the amount we need to deposit and also add the amount in the last transaction
            # -1 is for the last element in the table and 0 is for the balance
            transaction['balance']=float(table_data[-1][0])+float(data['amount'])
            transaction['lastTransaction']=data['amount']
        else:
            # if its the first transaction of the user we will directly add the amount
            transaction['balance']=float(data['amount'])
            transaction['lastTransaction']=data['amount']
        transaction['balance']=str(transaction['balance'])
        # adding the + sign to show increment in the balance and adding the dict in the table
        transaction['lastTransaction']='+'+str(transaction['lastTransaction'])
        insert_query='INSERT INTO '+data['username']+' VALUES (:balance, :lastTransaction)'
        cur.execute(insert_query,transaction)
        db.commit()
        db.close()
        return jsonify(transaction),201

#to withdraw from the users account ( works perfectly )
@app.route('/api/withdraw',methods=['POST'])
def withdraw():
    # if you access this app or any other thing that this app uses it raises an error so we can write this on a safe side
    with app.app_context():
        # to check if the request is a json object and it contains username and amount
        if not request.json or not ('username' in request.json and 'amount' in request.json):
            abort(400)
        # initializing data with username and amount from the request
        data={
            'username':request.json['username'],
            'amount':request.json.get('amount'),
        }
        db=sqlite3.connect('user.db')
        cur=db.cursor()
        # to check if the user exists
        table_name=check_user_data(data['username'])
        if not table_name:
            abort(404)
        # fetching the data from the user's table to get the balance from the last transaction
        table_data=get_user_data(data['username'])
        transaction={}
        # if the user has data already in the table and the withdraw amount is less than or equal to the balance then only execute withdrawal else abort 400 
        if table_data and float(table_data[-1][0])>=float(data['amount']):
            # subtracting the amount from the balance and updating the last transaction of the transaction dict
            transaction['balance']=float(table_data[-1][0])-float(data['amount'])
            transaction['lastTransaction']=data['amount']
        # if the withdraw amount is more than the balance then abort 400
        elif not float(table_data[-1][0])>=float(data['amount']) and table_data:
            abort(400)
        # if its the user's first transaction then to prevent withdrawal we abort 400
        else:
            abort(400)
        # adding a - sign to indicate deduction of amount from the balance and adding the dict in the database
        transaction['balance']=str(transaction['balance'])
        transaction['lastTransaction']='-'+str(transaction['lastTransaction'])
        insert_query='INSERT INTO '+data['username']+' VALUES (:balance, :lastTransaction)'
        cur.execute(insert_query,transaction)
        db.commit()
        db.close()
        return jsonify(transaction),201

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8085)

#curl -d '{"username":"manan","password":"12356"}' -H "Content-Type:application/json" -X POST http://0.0.0.0:8085/api/delete
