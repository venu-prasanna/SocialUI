import React,{Component} from 'react';
import {View,Text,StyleSheet,Dimensions,Animated,TouchableOpacity,Image,PanResponder} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import ChatComponent from './components/ChatComponent';

const SCREEN_HIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const USERS = [
    {id:"1",uri: require('./images/test1.jpg')},
    {id:"2",uri: require('./images/test2.jpg')},
    {id:"3",uri: require('./images/test3.jpg')},
    {id:"4",uri: require('./images/test4.jpg')},
    {id:"5",uri: require('./images/test5.jpg')},
]

console.disableYellowBox = true;

class App extends Component{
    constructor(props){
        super(props);
        
        this.position = new Animated.ValueXY();
        this.state = {
            currentIndex:0,
            view:'Home'
        }
        this.rotate = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_HIGHT/2],
            outputRange:['-10deg','0deg','10deg'],
            extrapolate:'clamp'
        })

        this.rotateAndTranslate = {
            transform:[{
                rotate:this.rotate
            },
            ...this.position.getTranslateTransform()
        ]
        }

        this.likeOpacity = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_HIGHT/2],
            outputRange:[0,0,1],
            extrapolate:'clamp'
        })

        this.dislikeOpacity = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_HIGHT/2],
            outputRange:[1,0,0],
            extrapolate:'clamp'
        })

        this.nextCardOpacity = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_HIGHT/2],
            outputRange:[1,0,1],
            extrapolate:'clamp'
        })

        this.nextCardScale = this.position.x.interpolate({
            inputRange:[-SCREEN_WIDTH/2,0,SCREEN_HIGHT/2],
            outputRange:[1,0.8,1],
            extrapolate:'clamp'
        })
        
        this.onChangeView = this.onChangeView.bind(this);
    }

    onChangeView(viewName){
        if(this.state.view !== viewName){
            this.setState({view:viewName});
        }
    }

    componentWillMount(){
        this.PanResponder = PanResponder.create({
            onStartShouldSetPanResponder:(evt,gestureState) => true,
            onPanResponderMove:(evt,gestureState) => {
                this.position.setValue({x:gestureState.dx,y:gestureState.dy})
            },
            onPanResponderRelease:(evt,gestureState) => {
                if(gestureState.dx>120){
                    Animated.spring(this.position,{
                        toValue:{x:SCREEN_WIDTH+100,y:gestureState.dy}
                    }).start(()=>{
                        this.setState({currentIndex:this.state.currentIndex+1},()=>{
                            this.position.setValue({x:0,y:0})
                        })
                    })
                }
                else if(gestureState.dx < -120){
                    Animated.spring(this.position,{
                        toValue:{x:-SCREEN_WIDTH-100,y:gestureState.dy}
                    }).start(()=>{
                        this.setState({currentIndex:this.state.currentIndex+1},()=>{
                            this.position.setValue({x:0,y:0})
                        })
                    })
                }
                else{
                    Animated.spring(this.position,{
                        toValue:{x:0,y:0},
                        friction:4
                    }).start()
                }
            }
        })
    }

    renderUsers = () => {
        return USERS.map((item,i)=>{
            if(i<this.state.currentIndex){
                return null
            }
            else if(i == this.state.currentIndex){
                return (
                    <Animated.View 
                        {...this.PanResponder.panHandlers}
                        key={item.id} style={
                            [this.rotateAndTranslate,
                            {height:SCREEN_HIGHT-120,width:SCREEN_WIDTH,padding:10,position:'absolute'}]}>
                        <Animated.View
                            style={{opacity:this.likeOpacity,transform:[{rotate:'-30deg'}],position:'absolute',top:50,left:40,zIndex:1000}}
                        >
                            <Text style={{borderWidth:1,borderColor:'green',color:'green',fontSize:32,fontWeight:'800',padding:10}}>
                                Like
                            </Text>
                        </Animated.View>
                        <Animated.View
                            style={{opacity:this.dislikeOpacity,transform:[{rotate:'30deg'}],position:'absolute',top:50,right:40,zIndex:1000}}
                        >
                            <Text style={{borderWidth:1,borderColor:'red',color:'red',fontSize:32,fontWeight:'800',padding:10}}>
                                dislike
                            </Text>
                        </Animated.View>
                        <Image 
                            style={{flex:1,height:null,width:null,resizeMode:'cover',borderRadius:20 }}
                            source={item.uri}
                        />
                    </Animated.View>
                )
            }
            else{
                return (
                    <Animated.View 
                        key={item.id} style={
                            [{opacity:this.nextCardOpacity,transform:[{scale:this.nextCardScale}]},
                            {height:SCREEN_HIGHT-120,width:SCREEN_WIDTH,padding:10,position:'absolute'}]}>
                        <Image 
                            style={{flex:1,height:null,width:null,resizeMode:'cover',borderRadius:20 }}
                            source={item.uri}
                        />
                    </Animated.View>
                )
            }
        }).reverse()
    }

    render(){
        if(this.state.view === 'Home'){
            return(
                <View style={styles.container}>
                    <View style={{flex:1}}>
                        {this.renderUsers()}
                    </View>
                    <View style={styles.navBarStyle}>
                        <TouchableOpacity onPress={()=>alert('clicked likes')}>
                            <Icon name="heart" size={40} color={'#e85e56'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onChangeView('Chat')}>
                            <Icon name="comment-o" size={40} color={'#6689d4'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({view:'Home'})}>
                            <Icon name="home" size={50} color={'grey'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.setState({currentIndex:0})}>
                            <Icon name="repeat" size={40} color={'#d46c66'}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>alert('settings')}>
                            <Icon name="gear" size={40} color={'grey'}/>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
        else if(this.state.view === 'Chat'){
            return(
                <View style={styles.container}>
                    <ChatComponent onChangeView={()=>this.onChangeView('Home')} />
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        // backgroundColor:'#120b26'
        // backgroundColor:'#edccca'
    },
    navBarStyle:{
        borderRadius:10,
        backgroundColor:'transparent',
        height:60,
        padding:10,
        margin:20,
        bottom:15,
        // opacity:0.5,
        flexDirection:'row',
        justifyContent:'space-around',
    }
})

export default App; 