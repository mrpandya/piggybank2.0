from flask import Flask,request,jsonify,abort
from flask_cors import CORS, cross_origin
import sqlite3

app =Flask(__name__)
cors=CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def home():
    return '''
        <h1> Welcome to piggy bank api<h1>
    '''

############################ DEFINED FUNCTIONS ###############################

def find_table(user):
    db=sqlite3.connect('piggybank.db')
    cur=db.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
    table_name=None
    data=cur.fetchall()
    db.close()
    for row in data:
        if row[0]==user:
            table_name=row[0]
            break
    if not table_name:return False
    else: return table_name

def fetch_table_data(table_name):
    db =sqlite3.connect('piggybank.db')
    cur=db.cursor()
    cur.execute("SELECT * FROM {}".format(table_name))
    data=[]
    data=cur.fetchall()
    db.close()
    return data

# ##################################### GET METHODS #################################

#to get all the user
@app.route('/api/all',methods=['GET'])
def all_users():
    with app.app_context():
        users=None
        index=0
        db=sqlite3.connect('piggybank.db')
        cur=db.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table'")
        data=cur.fetchall()
        if not data:
            abort(404)
        else:
            users={}
            for user in data:
                users[index]=user[0]
                index+=1
        return jsonify(users)


#to get the balance of a user
@app.route('/api/balance/<user>',methods=['GET'])
def balance_user(user):
    with app.app_context(): #if you access this ap or any other thing that this app uses it raises an error so we can write this on a safe side
        user_info={}
        user_balance=None
        db=sqlite3.connect('piggybank.db')
        cur=db.cursor()
        table_name=find_table(user)
        if table_name == None:
            abort(404)
        else:
            data=fetch_table_data(table_name)
            if not data:
                # abort(404)
                return jsonify({0:{'user':table_name,'balance':'0'}}),200
            user_balance=data[-1][0]
            user_info['user']=table_name
            user_info['balance']=user_balance
            return jsonify(user_info)

#to get the statement of the user account
@app.route('/api/statement/<user>',methods=['GET'])
def statement_user(user):
    with app.app_context():
        statement={}
        table_name=None
        table_data=None
        index=0
        db=sqlite3.connect('piggybank.db')
        cur=db.cursor()
        table_name=find_table(user)
        if not table_name:
            abort(404)
        else:
            table_data=fetch_table_data(table_name)
            if not table_data:
                # abort(404)
                return jsonify({0:{'balance':'0','last_transaction':'0'}}),200
            table_data=table_data[::-1] #reversing the data for the latest transaction to come first
            for data in table_data:
                transaction={}
                transaction['last_transaction']=data[1]
                transaction['balance']=data[0]
                statement[index]=transaction
                index+=1
            db.close()
            return jsonify(statement),200

#to create a new user
@app.route('/api/create/<user>',methods=['GET'])
def create(user):
    with app.app_context():
        table_name=find_table(user)
        if table_name:
            abort(400)
        else:
            db=sqlite3.connect('piggybank.db')
            cur=db.cursor()
            query='CREATE TABLE IF NOT EXISTS '+user+' (balance TEXT,last_tranasction TEXT)'
            cur.execute(query)
            db.commit()
            table_name=find_table(user)
            if not table_name:
                abort(502)
            else:
                return jsonify({"new_user":user}),201

#to delete a account
@app.route('/api/delete/<user>',methods=['GET'])
def delete(user):
    with app.app_context():
        table_name=find_table(user)
        if not table_name:
            abort(400)
        else:
            db=sqlite3.connect('piggybank.db')
            cur=db.cursor()
            query = 'DROP table '+table_name
            cur.execute(query)
            table_name=find_table(user)
            if table_name:
                abort(502)
            else:
                return jsonify({'deleted_user':user}),201

# ################################# POST METHODS #################################

@app.route('/api/deposit',methods=['POST'])
def deposit():
    with app.app_context():
        if not request.json or not 'user' in request.json:
            abort(400)
        data={
            'user':request.json['user'],
            'amount':request.json.get('amount'),
        }
        db=sqlite3.connect('piggybank.db')
        cur=db.cursor()
        table_name=find_table(data['user'])
        if not table_name:
            abort(404)
        table_data=fetch_table_data(table_name)
        transaction={}
        if table_data:
            transaction['balance']=float(table_data[-1][0])+float(data['amount'])
            transaction['lasttransaction']=data['amount']
        else:
            transaction['balance']=float(data['amount'])
            transaction['lasttransaction']=data['amount']
        transaction['balance']=str(transaction['balance'])
        transaction['lasttransaction']='+'+str(transaction['lasttransaction'])
        insert_query='INSERT INTO '+str(table_name)+' VALUES (:balance, :lasttransaction)'
        cur.execute(insert_query,transaction)
        db.commit()
        db.close()
        return jsonify(transaction),201
    
@app.route('/api/withdraw',methods=['POST'])
def withdraw():
    with app.app_context():
        if not request.json or not 'user' in request.json:
            abort(400)
        data={
            'user':request.json['user'],
            'amount':request.json.get('amount'),
        }
        db=sqlite3.connect('piggybank.db')
        cur=db.cursor()
        table_name=find_table(data['user'])
        if not table_name:
            abort(404)
        table_data=fetch_table_data(table_name)
        transaction={}
        if table_data and float(table_data[-1][0])>=float(data['amount']):
            transaction['balance']=float(table_data[-1][0])-float(data['amount'])
            transaction['lasttransaction']=data['amount']
        elif not float(table_data[-1][0])>=float(data['amount']):
            abort(400)
        else:
            transaction['balance']=float(data['amount'])
            transaction['lasttransaction']=data['amount']
        transaction['balance']=str(transaction['balance'])
        transaction['lasttransaction']='-'+str(transaction['lasttransaction'])
        insert_query='INSERT INTO '+str(table_name)+' VALUES (:balance, :lasttransaction)'
        cur.execute(insert_query,transaction)
        db.commit()
        db.close()
        return jsonify(transaction),201

if __name__=="__main__":
    app.run()

# app.run(debug=True, host='0.0.0.0', port=port)