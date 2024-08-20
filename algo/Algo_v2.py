"""
╭━━━╮╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭╮╱╱╭╮╱╱╱╱╱╱╱╱╭━━━┳╮╱╱╱╱╱╱╱╱╱╭╮
┃╭━╮┃╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱┃┃╱╭╯╰╮╱╱╱╱╱╱╱┃╭━╮┃┃╱╱╱╱╱╱╱╱╭╯╰╮
┃╰━╯┣━━┳━━┳━━┳╮╭┳━━┳━╮╭━╯┣━┻╮╭╋┳━━┳━╮╱┃┃╱┃┃┃╭━━┳━━┳━╋╮╭╋┳╮╭╮
┃╭╮╭┫┃━┫╭━┫╭╮┃╰╯┃┃━┫╭╮┫╭╮┃╭╮┃┃┣┫╭╮┃╭╮╮┃╰━╯┃┃┃╭╮┃╭╮┃╭╋┫┃┣┫╰╯┃
┃┃┃╰┫┃━┫╰━┫╰╯┃┃┃┃┃━┫┃┃┃╰╯┃╭╮┃╰┫┃╰╯┃┃┃┃┃╭━╮┃╰┫╰╯┃╰╯┃┃┃┃╰┫┃┃┃┃
╰╯╰━┻━━┻━━┻━━┻┻┻┻━━┻╯╰┻━━┻╯╰┻━┻┻━━┻╯╰╯╰╯╱╰┻━┻━╮┣━━┻╯╰┻━┻┻┻┻╯
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╭━╯┃
╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╱╰━━╯

#----------------// V2 //--------------------------


By Ian Bezzerra - Aug/2024

- Version one of the interaction based Recomendation
algoritim for USPerdido.

"""

#----------------// Parsing Data!! //--------------------------
# Importing Modules!!

import json

# Creating the classes!!

class Com():
    def __init__(self, Posts=[]):
        self.Posts = Posts

class Post():
    def __init__(self, ID, Type, Caption, Username,  Description, Ptype, Comments=[], Clicks=[], Likes=[]):
        self.ID = ID
        self.Type = Type
        self.Caption = Caption
        self.Username = Username
        self.Description = Description
        self.Ptype = Ptype
        self.Comments = Comments
        self.Clicks = Clicks
        self.Likes = Likes
        

# Importing the File!!

with open("../db/Posts/posts.json", "r") as UserData:
    data = json.load(UserData)

    ComNames = []
    for Community in data:
        ComNames.append(Community)
     
    PostsLib = [] 
    for Community in data.values():
        PostsT = []
        for P in Community:
            try:
                Temp =  Post(P["id"], P["type"], P["caption"], P["Username"],  P["description"], P["Ptype"], P["comments"], P["clicks"], P["likes"])
            except:
                Temp =  Post(P["id"], P["type"], P["caption"], P["Username"],  P["description"], P["Ptype"], P["comments"])
            
            
            PostsT.append(Temp)
   


        PostsLib.append(PostsT)
    
    D = {name: coms for name, coms in zip(ComNames, PostsLib)}
    #print(D)




#----------------// Constructing Community Graphs!! //-----------------

C = D["C1"]

#print(C)

I_Likes = []


#-- Counting Likes  -------------------
for post in C:
    for like in post.Likes:
        if (post.Username != like):
            I_Likes.append((post.Username, like))


#print(I_Likes)


#--  Counting Clicks  -------------------

I_Clicks = []


for post in C:
    for click in post.Clicks:
        if (post.Username != click):
            I_Clicks.append((post.Username, click))

#print(I_Clicks)

#--  Counting Comments  -------------------

print("-------------")


I_Comments = []
I_Comebacks = {}

for post in C:
    for comment in post.Comments:
        if (post.Username != comment['username']):
            I_Comments.append((post.Username, comment['username']))
        else:
            if post.Username in I_Comebacks:
                I_Comebacks[post.Username] += 1
            else:
                I_Comebacks[post.Username] = 1


#print(I_Likes)
#print(I_Clicks)
#print(I_Comments)
#print(I_Comebacks)


"""
-------------------------------------------------------------

▄▀█ █░░ █▀▀ █▀█ █▀█ █ ▀█▀ █ █▀▄▀█
█▀█ █▄▄ █▄█ █▄█ █▀▄ █ ░█░ █ █░▀░█

#----// Algo //-----------

"""


import networkx as nx
import matplotlib.pyplot as plt

#----// Creatign DiGraph //-----------
G = nx.DiGraph()




#----// Function Libwary //-----------

def add_weighted_edges(G, edge_list, weight):
    for edge in edge_list:
        receiver, actor = edge
        if G.has_edge(actor, receiver):
            G[actor][receiver]['weight'] += weight
        else:
            G.add_edge(actor, receiver, weight=weight)



#----// Adding Interactions //-----------

add_weighted_edges(G, I_Clicks, 1)  # Clicks have weight 1
add_weighted_edges(G, I_Likes, 2)   # Likes have weight 2
add_weighted_edges(G, I_Comments, 3)  # Comments have weight 3

# Calculate Score for Nodes
total_score = {}
for node in G.nodes():
    outgoing_score = sum(G[node][neighbor]['weight'] for neighbor in G[node])
    incoming_score = sum(G[neighbor][node]['weight'] for neighbor in G.predecessors(node))
    total_score[node] = outgoing_score + incoming_score

# Create a layout where Y-coordinate is based on total score
pos = {}
x = 0
for node in sorted(total_score, key=total_score.get):
    pos[node] = (x, total_score[node])
    x += 1



#----// Plotting Figure //-----------  (Make this separate in the final)

plt.figure(figsize=(12, 8)) # Draw the graph

nx.draw_networkx_nodes(G, pos, node_color='lightblue', node_size=500)  # Draw nodes

# Draw edges with arrows
edge_weights = [G[u][v]['weight'] for u, v in G.edges()]
nx.draw_networkx_edges(G, pos, width=1, edge_color='gray', 
                       arrowsize=20, connectionstyle='arc3, rad=0.1')

# Draw node labels
nx.draw_networkx_labels(G, pos, font_size=8, font_weight='bold')

# Add edge labels (weights)
edge_labels = {(u, v): f'{d["weight"]}' for u, v, d in G.edges(data=True)}
nx.draw_networkx_edge_labels(G, pos, edge_labels=edge_labels, font_size=7, 
                             label_pos=0.5, bbox=dict(boxstyle='circle,pad=0.1', fc='white', ec='none', alpha=0.7))

plt.title("User Interaction Network (Weighted Score)", fontsize=16)
plt.xlabel("Users")
plt.ylabel("Total Weighted Score")
plt.tight_layout()
#plt.show()

# ---------------------------------------
def find_closest_user(G, user):
    if user not in G:
        return None
    
    max_weight = 0
    closest_user = None
    
    for neighbor in G[user]:
        weight = G[user][neighbor]['weight']
        if weight > max_weight:
            max_weight = weight
            closest_user = neighbor
    
    return closest_user

# ---------------------------------------


def rank_user_closeness(G):
    closeness_scores = {}
    ranked_closeness = {}

    # Calculate closeness scores
    for user1 in G.nodes():
        for user2 in G.nodes():
            if user1 != user2:
                score = 0
                if G.has_edge(user1, user2):
                    score += G[user1][user2]['weight']
                if G.has_edge(user2, user1):
                    score += G[user2][user1]['weight']
                if score > 0:
                    if user1 not in closeness_scores:
                        closeness_scores[user1] = {}
                    closeness_scores[user1][user2] = score

    # Rank users based on closeness scores
    for user, scores in closeness_scores.items():
        ranked_closeness[user] = sorted(scores, key=scores.get, reverse=True)

    return ranked_closeness

# ---------------------------------------
Main = rank_user_closeness(G)
for i in Main.items():
    print(f"{i}")
    print("--------------")

"""
Notes to Future browski

- This last functon gave me the ranked bets connedted users-> users
so just make the top(alltime, month, day)
- get the posts ranked from the day feed, and complete with the
best month feed)




"""
