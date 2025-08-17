import logging
from uuid import UUID
from typing import List, Dict, Any, Optional

from app.db.supabase import get_supabase_client, get_supabase_admin_client
from app.models.history import AnalysisHistoryCreate, AnalysisHistoryItem, AnalysisHistory

logger = logging.getLogger(__name__)

async def save_analysis_history(analysis_data: AnalysisHistoryCreate) -> Dict[str, Any]:
    """Save analysis result to history"""
    # Use admin client to bypass RLS policies
    client = get_supabase_admin_client()
    
    try:
        # Insert data into the analysis_history table
        response = client.table('analysis_history').insert({
            "user_id": str(analysis_data.user_id),
            "title": analysis_data.title,
            "file_type": analysis_data.file_type,
            "file_name": analysis_data.file_name,
            "file_url": analysis_data.file_url,
            "analysis_results": analysis_data.analysis_results,
            "dominant_emotion": analysis_data.dominant_emotion,
            "overall_score": analysis_data.overall_score,
            "message_count": analysis_data.message_count,
            "participants": analysis_data.participants
        }).execute()
        
        if "error" in response:
            logger.error(f"Failed to save analysis history: {response['error']}")
            return {"success": False, "error": response["error"]}
        
        return {"success": True, "data": response.data[0]}
    except Exception as e:
        logger.error(f"Error saving analysis history: {str(e)}")
        return {"success": False, "error": str(e)}

async def get_user_analysis_history(user_id: UUID) -> List[AnalysisHistoryItem]:
    """Get analysis history for a specific user"""
    logger.info(f"Getting analysis history for user {user_id}")
    
    # Use admin client to ensure we can bypass RLS if needed
    client = get_supabase_admin_client()
    
    try:
        query = client.table('analysis_history').select(
            "id, title, date, dominant_emotion, overall_score, message_count, participants, file_type"
        ).eq('user_id', str(user_id)).order('date', desc=True)
        
        logger.info(f"Executing query: {query}")
        response = query.execute()
        
        if "error" in response:
            logger.error(f"Failed to get analysis history: {response['error']}")
            return []
        
        logger.info(f"Found {len(response.data)} history items for user {user_id}")
        logger.info(f"Data: {response.data}")
        
        result = [AnalysisHistoryItem(**item) for item in response.data]
        return result
    except Exception as e:
        logger.error(f"Error getting analysis history: {str(e)}")
        return []

async def get_analysis_detail(history_id: UUID, user_id: UUID) -> Optional[AnalysisHistory]:
    """Get detailed analysis by id"""
    logger.info(f"Getting analysis detail for history_id={history_id}, user_id={user_id}")
    
    # Use admin client to ensure we can bypass RLS if needed
    client = get_supabase_admin_client()
    
    try:
        query = client.table('analysis_history').select(
            "*"
        ).eq('id', str(history_id)).eq('user_id', str(user_id)).limit(1)
        
        logger.info(f"Executing query: {query}")
        response = query.execute()
        
        if "error" in response:
            logger.error(f"Failed to get analysis detail: {response.get('error')}")
            return None
            
        if not response.data:
            logger.error("No data found for the given history_id and user_id")
            return None
        
        logger.info(f"Analysis detail found: {response.data[0]}")
        return AnalysisHistory(**response.data[0])
    except Exception as e:
        logger.error(f"Error getting analysis detail: {str(e)}")
        return None

async def delete_analysis(history_id: UUID, user_id: UUID) -> Dict[str, Any]:
    """Delete an analysis from history"""
    logger.info(f"Deleting analysis with history_id={history_id}, user_id={user_id}")
    
    # Use admin client to ensure we can bypass RLS if needed
    client = get_supabase_admin_client()
    
    try:
        # First check if the item belongs to this user
        check_query = client.table('analysis_history').select("id").eq('id', str(history_id)).eq('user_id', str(user_id))
        logger.info(f"Executing check query: {check_query}")
        check_response = check_query.execute()
        
        if not check_response.data:
            logger.warning(f"Attempt to delete analysis that doesn't belong to user or doesn't exist: history_id={history_id}, user_id={user_id}")
            return {"success": False, "error": "Analysis not found or doesn't belong to you"}
        
        # Delete the item
        delete_query = client.table('analysis_history').delete().eq('id', str(history_id)).eq('user_id', str(user_id))
        logger.info(f"Executing delete query: {delete_query}")
        response = delete_query.execute()
        
        if "error" in response:
            logger.error(f"Failed to delete analysis: {response['error']}")
            return {"success": False, "error": response["error"]}
        
        logger.info(f"Analysis deleted successfully: {response.data}")
        return {"success": True, "data": response.data}
    except Exception as e:
        logger.error(f"Error deleting analysis: {str(e)}")
        return {"success": False, "error": str(e)}
