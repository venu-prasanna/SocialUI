import React,{Component} from 'react'
import {View,StyleSheet,Text,TouchableOpacity,ScrollView,Dimensions,TextInput} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SAMPLE_CHAT_DATA = [
    {user:'sent',text:'hi'},
    {user:'received',text:'hello'},
]

class ChatComponent extends Component{
    constructor(props){
        super(props);
        this.state = {message:""}
    }

    onMessageSend(){
        if(this.state.message !== ""){
            SAMPLE_CHAT_DATA.push({
                user:'sent',text:this.state.message
            })
            this.setState({message:""})
        }
    }

    render(){
        const chats = [];
        SAMPLE_CHAT_DATA.forEach((item)=>{
            const text_length = item.text.length;
            if(item.user === 'sent'){
                chats.push(
                    <View>
                        <View style={styles.chatSent}>
                            <Text style={{margin:5,textAlign:'center'}}>{item.text}</Text>
                        </View>
                    </View>
                );
            }
            else if(item.user === 'received'){
                chats.push(
                    <View>
                        <View style={styles.chatReceived}>
                            <Text style={{margin:5,textAlign:'center'}}>{item.text}</Text>
                        </View>
                    </View>
                );
            }
        })

        return(
            <View style={styles.container}>
                <View style={styles.header}> 
                    <TouchableOpacity onPress={()=>this.props.onChangeView()} >
                        <Icon name='chevron-left' size={10} style={{marginLeft:10,color:'white'}}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.chatContainer}>
                    <ScrollView>
                        {chats}    
                    </ScrollView>
                </View>
                <View style={styles.chatInput}>
                    <TextInput 
                        style={{borderRadius:20,
                        borderColor:'grey',
                        borderWidth:2,
                        margin:5,
                        width:"85%",
                        height:40
                        }} 
                        value={this.state.message}
                        onChangeText={text=>this.setState({message:text})}
                        />
                    <TouchableOpacity onPress={()=>this.onMessageSend()}>
                        <Icon name="send"  
                        style={{margin:10,color:'#0c94c9'}}
                        size={30}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:3
    },
    header:{
        backgroundColor:'black',
        height:"5%",
        justifyContent:'center',
    },
    chatContainer:{
        flex:2
    },
    chatSent:{
        backgroundColor:'#0c94c9',
        margin:5,
        flex:1,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignSelf:'flex-end',
        borderTopLeftRadius:10,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10,
    },
    chatReceived:{
        backgroundColor:'#0cc96e',
        margin:5,
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        alignSelf:'flex-start',
        borderTopRightRadius:10,
        borderBottomRightRadius:10,
        borderBottomLeftRadius:10
    },
    chatInput:{
        backgroundColor:'white',
        height:"8%",
        flexDirection:'row',
    },
})

export default ChatComponent;